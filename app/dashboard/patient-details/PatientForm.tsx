"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { upsertPatientDetails } from "@/lib/actions/patient";
import { PatientDetails, SUPPORTED_LANGUAGES } from "@/types";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh","Other",
];

interface Props {
  patient: PatientDetails | null;
}

export default function PatientForm({ patient }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSaved(false);

    startTransition(async () => {
      const result = await upsertPatientDetails(formData);
      if (!result.success) {
        toast.error(result.error);
      } else {
        setSaved(true);
        toast.success("Patient details saved successfully!");
      }
    });
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all placeholder:text-slate-300";
  const selectCls =
    "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all text-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section: Personal Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">Full name *</label>
            <input
              name="full_name"
              defaultValue={patient?.full_name || ""}
              required
              placeholder="Ravi Kumar Singh"
              className={inputCls}
            />
          </div>
          <div>
            <label className="field-label">Age *</label>
            <input
              name="age"
              type="number"
              defaultValue={patient?.age || ""}
              required
              min={1}
              max={120}
              placeholder="32"
              className={inputCls}
            />
          </div>
          <div>
            <label className="field-label">Gender *</label>
            <select name="gender" defaultValue={patient?.gender || ""} required className={selectCls}>
              <option value="" disabled>Select gender</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Blood group</label>
            <select name="blood_group" defaultValue={patient?.blood_group || ""} className={selectCls}>
              <option value="">Not known</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Phone number</label>
            <input
              name="phone"
              type="tel"
              defaultValue={patient?.phone || ""}
              placeholder="+91 98765 43210"
              className={inputCls}
            />
          </div>
          <div>
            <label className="field-label">Preferred language</label>
            <select name="preferred_language" defaultValue={patient?.preferred_language || "en"} className={selectCls}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section: Location */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
          Location
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="field-label">Address / House no.</label>
            <input
              name="address"
              defaultValue={patient?.address || ""}
              placeholder="House no., street"
              className={inputCls}
            />
          </div>
          <div>
            <label className="field-label">Village / Town</label>
            <input
              name="village"
              defaultValue={patient?.village || ""}
              placeholder="Rampur"
              className={inputCls}
            />
          </div>
          <div>
            <label className="field-label">District</label>
            <input
              name="district"
              defaultValue={patient?.district || ""}
              placeholder="Varanasi"
              className={inputCls}
            />
          </div>
          <div>
            <label className="field-label">State</label>
            <select name="state" defaultValue={patient?.state || ""} className={selectCls}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Country</label>
            <input
              name="country"
              defaultValue={patient?.country || "India"}
              placeholder="India"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Section: Emergency Contact */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
          Emergency Contact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Contact name</label>
            <input
              name="emergency_contact_name"
              defaultValue={patient?.emergency_contact_name || ""}
              placeholder="Sunita Kumar"
              className={inputCls}
            />
          </div>
          <div>
            <label className="field-label">Contact phone</label>
            <input
              name="emergency_contact_phone"
              type="tel"
              defaultValue={patient?.emergency_contact_phone || ""}
              placeholder="+91 98765 00000"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Section: Medical History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
          Medical History
        </h2>
        <div className="space-y-4">
          <div>
            <label className="field-label">Known allergies</label>
            <textarea
              name="known_allergies"
              defaultValue={patient?.known_allergies || ""}
              placeholder="e.g., Penicillin, Sulfa drugs, peanuts..."
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className="field-label">Chronic conditions</label>
            <textarea
              name="chronic_conditions"
              defaultValue={patient?.chronic_conditions || ""}
              placeholder="e.g., Diabetes Type 2, Hypertension, Asthma..."
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className="field-label">Current medications</label>
            <textarea
              name="current_medications"
              defaultValue={patient?.current_medications || ""}
              placeholder="e.g., Metformin 500mg, Amlodipine 5mg..."
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        {saved && (
          <div className="flex items-center gap-2 text-teal-600 text-sm font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Changes saved!
          </div>
        )}
        <div className="ml-auto">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {patient ? "Update details" : "Save details"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
