import React, { useEffect, useState } from "react";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../configs/api";

const Preview = () => {
  const { resumeId } = useParams();
  const validResumeId = resumeId && resumeId !== "undefined" ? resumeId : null;
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const loadResume = async () => {
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
  }, [resumeId, validResumeId]);

  return resumeData ? (
    <div className="vintage-app-shell min-h-screen">
      <div className="mx-auto max-w-3xl py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          className="bg-[var(--vintage-paper)] py-4"
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="vintage-app-shell flex h-screen flex-col items-center justify-center">
          <p className="text-center font-display text-6xl font-medium text-[var(--vintage-walnut)]">
            Resume not found
          </p>
          <a
            href="/"
            className="vintage-btn-primary mt-6 m-1 flex h-10 items-center rounded-full px-6"
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
