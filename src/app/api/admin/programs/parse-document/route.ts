import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';
export const maxDuration = 60; // Allow sufficient time for multi-page PDF processing

interface ExtractedProgram {
  title: string;
  universityName?: string;
  degreeLevel?: string;
  faculty?: string;
  duration?: string;
  intakeMonths?: string;
  tuitionMYR?: number;
  firstYearFeeMYR?: number;
  secondYearFeeMYR?: number;
  thirdYearFeeMYR?: number;
  fourthYearFeeMYR?: number;
  emgsFeeMYR?: number;
  miscFeesMYR?: number;
  totalInitialMYR?: number;
  scholarship?: string;
  academicReq?: string;
  englishReq?: string;
  pakistanNotes?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured in .env. Please set GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetUniversityName = (formData.get('universityName') as string) || '';
    const customInstructions = (formData.get('customInstructions') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No document file uploaded.' }, { status: 400 });
    }

    const mimeType = file.type;
    const allowedMimeTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(mimeType) && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: `Unsupported file type (${mimeType || 'unknown'}). Please upload a PDF or Image (PNG, JPG, WEBP).` },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    const effectiveMimeType = mimeType || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

    const promptText = `
You are an expert Malaysian Higher Education Fee Structure Analyst and Data Extractor.
Extract all study programs and their complete fee breakdown from the attached university fee structure document (${file.name}).

${targetUniversityName ? `TARGET UNIVERSITY: "${targetUniversityName}" (All programs belong to this university unless explicitly stated otherwise).` : 'Identify the university name from the document header, logo, or text.'}
${customInstructions ? `EXTRA INSTRUCTIONS: "${customInstructions}"` : ''}

CRITICAL EXTRACTION RULES:
1. Identify every individual academic program (e.g., Bachelor of Computer Science, Diploma in Business, Master of Engineering, Foundation in Science, PhD).
2. Handle all table orientations (portrait, landscape, rotated columns, side-by-side tables).
3. If fees are listed for International Students vs Local Students, ALWAYS extract the INTERNATIONAL STUDENT fees (in Malaysian Ringgit / MYR / RM). If in USD, convert approximately or note it.
4. Extract numeric fees without currency symbols, commas, or letters (e.g. 45000 not "RM 45,000"):
   - "tuitionMYR": Total program tuition fee. If not explicitly given, sum year 1 + 2 + 3 + 4.
   - "firstYearFeeMYR": Total fee for Year 1.
   - "secondYearFeeMYR": Total fee for Year 2 (or 0 if not applicable).
   - "thirdYearFeeMYR": Total fee for Year 3 (or 0 if not applicable).
   - "fourthYearFeeMYR": Total fee for Year 4 (or 0 if not applicable).
   - "emgsFeeMYR": EMGS / Visa / Medical / Student pass fee (typically 2,500 to 4,000 MYR, default 3500 if not stated).
   - "miscFeesMYR": Registration fee + Resource fee + Library + Caution deposit + International student charge (default 6000 if not itemized).
   - "totalInitialMYR": Total upfront initial payment required before arrival / at registration (typically EMGS + Misc or Year 1 Deposit).
5. "degreeLevel" must be standardized to one of:
   - "Bachelor's Degree"
   - "Master's Degree"
   - "Diploma"
   - "PhD / Doctorate"
   - "Foundation"
   - "Certificate"
6. "duration": e.g. "3 Years", "4 Years", "2 Years", "1.5 Years", "1 Year".
7. "intakeMonths": e.g. "January, May, September" or whatever is specified.
8. "faculty": Department or school (e.g. "School of Computing & Technology", "Faculty of Business", "Engineering").
9. "scholarship": Mention any early-bird discount, merit scholarship (e.g. "Up to 30% merit waiver").
10. "academicReq": General academic entry requirement if visible in the document.
11. "englishReq": English requirement (e.g. "IELTS 5.0 - 6.0 or Duolingo").
12. "pakistanNotes": Helpful notes for Pakistani / international students (e.g., "12 years education required").

OUTPUT FORMAT:
Return ONLY a valid JSON array of objects. Do not add conversational text or markdown explanation outside the JSON array.
Example structure:
[
  {
    "title": "Bachelor of Software Engineering (Honours)",
    "universityName": "${targetUniversityName || 'University Name'}",
    "degreeLevel": "Bachelor's Degree",
    "faculty": "Faculty of Computing",
    "duration": "3 Years",
    "intakeMonths": "March, July, November",
    "tuitionMYR": 72000,
    "firstYearFeeMYR": 24000,
    "secondYearFeeMYR": 24000,
    "thirdYearFeeMYR": 24000,
    "fourthYearFeeMYR": 0,
    "emgsFeeMYR": 3500,
    "miscFeesMYR": 6500,
    "totalInitialMYR": 10000,
    "scholarship": "Up to 25% High Achiever Scholarship",
    "academicReq": "HSSC / A-Levels with minimum 60%",
    "englishReq": "IELTS 5.5",
    "pakistanNotes": "Eligible for Pakistani students with FSc / ICS"
  }
]
`;

    let rawResponseText = '';

    // Initialize Google GenAI client
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Preferred models for multimodal document extraction
      const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
      let lastErr: any = null;

      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                inlineData: {
                  mimeType: effectiveMimeType,
                  data: base64Data,
                },
              },
              {
                text: promptText,
              },
            ],
            config: {
              temperature: 0.1, // Low temperature for high accuracy on numbers
            },
          });

          if (response && response.text) {
            rawResponseText = response.text;
            break;
          }
        } catch (err: any) {
          lastErr = err;
          // If model doesn't exist, try next
          continue;
        }
      }

      if (!rawResponseText && lastErr) {
        throw lastErr;
      }
    } catch (genAiError: any) {
      console.error('Gemini SDK Error, attempting direct REST fallback:', genAiError);
      
      // Fallback: direct REST API call in case SDK auth differences
      try {
        const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
        const restRes = await fetch(restUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    inline_data: {
                      mime_type: effectiveMimeType,
                      data: base64Data,
                    },
                  },
                  {
                    text: promptText,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
            },
          }),
        });

        if (!restRes.ok) {
          const errBody = await restRes.text();
          throw new Error(`Gemini API returned ${restRes.status}: ${errBody}`);
        }

        const restData = await restRes.json();
        rawResponseText = restData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch (fallbackError: any) {
        return NextResponse.json(
          {
            error: `Failed to process document with Gemini AI: ${genAiError.message || fallbackError.message}`,
            details: genAiError.message || String(genAiError),
          },
          { status: 500 }
        );
      }
    }

    if (!rawResponseText) {
      return NextResponse.json(
        { error: 'Gemini AI returned an empty response. Please check document clarity or try another file.' },
        { status: 500 }
      );
    }

    // Clean JSON output (strip Markdown code blocks if present)
    let cleanedJson = rawResponseText.trim();
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    // Parse JSON
    let extractedPrograms: ExtractedProgram[] = [];
    try {
      const parsed = JSON.parse(cleanedJson);
      if (Array.isArray(parsed)) {
        extractedPrograms = parsed;
      } else if (parsed && Array.isArray(parsed.programs)) {
        extractedPrograms = parsed.programs;
      } else {
        throw new Error('AI output was not an array of programs.');
      }
    } catch (parseError: any) {
      console.error('Failed to parse AI JSON:', parseError, cleanedJson.slice(0, 500));
      return NextResponse.json(
        {
          error: 'AI generated response could not be parsed as structured JSON. Please try again.',
          rawOutput: cleanedJson.slice(0, 1000),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      count: extractedPrograms.length,
      programs: extractedPrograms,
    });
  } catch (error: any) {
    console.error('Document parsing exception:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while processing document' },
      { status: 500 }
    );
  }
}
