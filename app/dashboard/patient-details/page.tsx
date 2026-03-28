import { getPatientDetails } from "@/lib/actions/patient";
import PatientForm from "./PatientForm";
import { User, ShieldCheck } from "lucide-react";

export default async function PatientDetailsPage() {
  const patient = await getPatientDetails();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-teal-700" />
          </div>
          <h1 className="section-heading">Patient Details</h1>
        </div>
        <p className="text-sm text-slate-500 ml-11">
          Your medical profile helps VaidyaAI give you more accurate and personalized guidance.
        </p>
      </div>

      {!patient && (
        <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Complete your profile</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Fill in your details to unlock the full symptom chat experience.
            </p>
          </div>
        </div>
      )}

      <PatientForm patient={patient} />
    </div>
  );
}
