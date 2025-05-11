import { useEffect, useState } from "react";
import { getToken } from "../helpers/auth";
import { Link } from "react-router-dom";

export default function Syntheses() {
  const [syntheses, setSyntheses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSyntheses = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:5000/api/syntheses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSyntheses(data);
      } catch (err) {
        console.error("Erreur chargement synthèses :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSyntheses();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📚 Mes Synthèses</h1>
        <Link to="/ajouter-synthese">
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            ➕ Ajouter une synthèse
          </button>
        </Link>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : syntheses.length === 0 ? (
        <p className="text-gray-600">Aucune synthèse trouvée.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Matière</th>
              <th className="px-4 py-2">Université</th>
              <th className="px-4 py-2">Niveau</th>
              <th className="px-4 py-2">tags</th>

              <th className="px-4 py-2">Fichier</th>
            </tr>
          </thead>
          
          <tbody>
            {syntheses.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{s.title}</td>
                <td className="px-4 py-2">{s.subject}</td>
                <td className="px-4 py-2"> {s.university}</td>
                <td className="px-4 py-2">{s.level}</td>
                <td className="px-4 py-2">{s.tags}</td>

                <td className="px-4 py-2">
                  {s.fichier ? (
                    <a
                      href={`http://localhost:5000/${s.fichier}`}
                      download
                      className="text-blue-600 underline"
                    >
                      📄 Télécharger
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Aucun fichier</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
