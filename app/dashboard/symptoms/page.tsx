import { getSessions } from "@/lib/actions/symptoms";
import { getPatientDetails } from "@/lib/actions/patient";
import SymptomsClient from "./SymptomsClient";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default async function SymptomsPage() {
  const [sessions, patient] = await Promise.all([
    getSessions(),
    getPatientDetails(),
  ]);

  if (!patient) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <h2
            className="text-xl font-bold text-slate-800 mb-2"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          >
            Complete your profile first
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            We need a few details about you to personalise your health
            consultations.
          </p>
          <Link
            href="/dashboard/patient-details"
            className="inline-block bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20"
          >
            Set up my profile
          </Link>
        </div>
      </div>
    );
  }

  const patientContext = `
Name: ${patient.full_name}
Age: ${patient.age}, Gender: ${patient.gender}
${patient.blood_group ? `Blood Group: ${patient.blood_group}` : ""}
${patient.chronic_conditions ? `Chronic Conditions: ${patient.chronic_conditions}` : ""}
${patient.known_allergies ? `Known Allergies: ${patient.known_allergies}` : ""}
${patient.current_medications ? `Current Medications: ${patient.current_medications}` : ""}
Location: ${[patient.village, patient.district, patient.state].filter(Boolean).join(", ")}
Preferred Language: ${patient.preferred_language}
  `.trim();

  return (
    <SymptomsClient
      initialSessions={sessions}
      patient={patient}
      patientContext={patientContext}
    />
  );
}
