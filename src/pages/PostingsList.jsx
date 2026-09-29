import { useEffect, useState } from "react";
import apiClient from "../api/client";

export default function PostingsList() {
  const [postings, setPostings] = useState([]);
  const [applicantsByPostingId, setApplicantsByPostingId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPostings() {
      try {
        const response = await apiClient.get("/applications");
        const content = response.data.content;
        setPostings(content);

        // Fetch applicants for each posting in parallel, rather than
        // one-at-a-time, since they don't depend on each other.
        const results = await Promise.all(
          content.map((posting) =>
            apiClient
              .get(`/applications/${posting.id}/applicants`)
              .then((res) => ({ id: posting.id, applicants: res.data })),
          ),
        );

        const applicantsMap = {};
        for (const result of results) {
          applicantsMap[result.id] = result.applicants;
        }
        setApplicantsByPostingId(applicantsMap);
      } catch (err) {
        setError("Failed to load postings.");
      } finally {
        setLoading(false);
      }
    }

    loadPostings();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Job Postings</h1>
      <div className="flex flex-col gap-4">
        {postings.map((posting) => (
          <div key={posting.id} className="border rounded p-4">
            <h2 className="text-lg font-semibold">{posting.company}</h2>
            <p className="text-sm text-gray-600">{posting.location}</p>
            <p className="text-sm text-gray-600">{posting.jobType}</p>

            <div className="mt-3">
              <p className="text-sm font-medium">
                Applicants ({applicantsByPostingId[posting.id]?.length ?? 0})
              </p>
              {applicantsByPostingId[posting.id]?.length > 0 ? (
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {applicantsByPostingId[posting.id].map((applicant, i) => (
                    <li key={i}>
                      {applicant.username} —{" "}
                      {applicant.applicationStatus ?? "No status"}
                      {applicant.dateApplied
                        ? ` (${applicant.dateApplied})`
                        : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No applicants yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
