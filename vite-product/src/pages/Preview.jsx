import React, { useEffect, useState } from "react";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../configs/api";


const Preview = () => {
  const { resumeId } = useParams();

const validResumeId =
  resumeId && resumeId !== "undefined" ? resumeId : null;

  const [isLoading, setIsLoading] = useState(true);

  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
  const loadResume = async () => {

    // ✅ BLOCK INVALID ID (MAIN FIX)
    if (!validResumeId) {
      console.error("Invalid resumeId:", resumeId);
      setResumeData(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get(`/resumes/public/${validResumeId}`);
      setResumeData(data?.resume || null);
    } catch (error) {
      console.error(error);
      setResumeData(null);
    } finally {
      setIsLoading(false);
    }
  };

  loadResume();
}, [validResumeId]);

  return resumeData ? (
    <div className="min-h-screen bg-[#FFF7E3]">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          className="bg-[#fbf6ef] py-4"
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex h-screen flex-col items-center justify-center bg-[#FFF7E3]">
          <p className="text-center text-6xl font-medium text-[#9d8a72]">
            Resume not found
          </p>
          <a
            href="/"
            className="mt-6 m-1 flex h-10 items-center rounded-full border border-[#028174] bg-[#028174] px-6 text-[#FFFBF1] transition-colors hover:bg-[#0AB68B]"
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            Go to Home Page
          </a>
        </div>
      )}
    </div>
  );
};

export default Preview;
