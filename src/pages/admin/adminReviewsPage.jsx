import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { MdDelete } from "react-icons/md";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/reviews", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setReviews(response.data);
          setLoaded(true);
        })
        .catch((error) => {
          console.error("Failed to load reviews", error);
        });
    }
  }, [loaded]);

  async function deleteReview(reviewID) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    await axios.delete(
      import.meta.env.VITE_BACKEND_URL + `/reviews/${reviewID}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    setLoaded(false); // refresh list
  }

  return (
    <div
      className="w-full flex justify-center p-4 md:p-10 relative
      bg-gradient-to-b from-primary to-white text-secondary"
    >
      {loaded ? (
        <div className="w-full overflow-x-auto">
          <table
            className="w-full min-w-[900px] max-w-7xl table-auto border-separate border-spacing-0
            rounded-2xl overflow-hidden shadow-xl bg-white/70"
          >
            <thead className="sticky top-0 z-10">
              <tr className="bg-secondary text-primary/95">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Review ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Telephone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-secondary/10">
              {reviews.map((item, index) => (
                <tr
                  key={index}
                  className="odd:bg-primary/60 even:bg-white hover:bg-primary/90 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-semibold">
                    {item.reviewID}
                  </td>

                  <td className="px-4 py-3 text-sm">{item.fname}</td>

                  <td className="px-4 py-3 text-sm font-semibold">
                    {item.lname}
                  </td>

                  <td className="px-4 py-3 text-sm text-secondary/90">
                    {item.email}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {item.telephone}
                  </td>

                  <td className="px-4 py-3 text-sm align-top max-w-[600px] whitespace-pre-wrap break-words">
                    {item.message}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => deleteReview(item.reviewID)}
                      className="p-2 bg-red-500 text-white rounded-lg
                      hover:bg-red-600 transition-all"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
