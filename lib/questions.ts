export const surveyQuestions = [
  { id: "q1", text: "Persyaratan pelayanan mudah dipenuhi atau disiapkan oleh konsumen" },
  { id: "q2", text: "Prosedur atau alur pelayanan mudah diikuti" },
  { id: "q3", text: "Jangka waktu penyelesaian pelayanan sesuai ketetapan" },
  { id: "q4", text: "Biaya pelayanan sesuai dengan biaya yang ditetapkan" },
  { id: "q5", text: "Produk pelayanan yang diterima sesuai dengan yang dijanjikan" },
  { id: "q6", text: "Sarana dan prasarana pendukung pelayanan memberikan kenyamanan" },
  { id: "q7", text: "Data BPS mudah diakses melalui fasilitas utama yang digunakan" },
  { id: "q8", text: "Petugas atau aplikasi pelayanan online merespon dengan baik" },
  { id: "q9", text: "Petugas atau aplikasi pelayanan online memberi informasi yang jelas" },
  { id: "q10", text: "Keberadaan fasilitas pengaduan PST mudah diketahui" },
  { id: "q11", text: "Proses penanganan pengaduan PST jelas dan tidak berbelit-belit" },
  { id: "q12", text: "Tidak ada diskriminasi dalam pelayanan" },
  { id: "q13", text: "Tidak ada penerimaan imbalan di luar ketentuan pelayanan" },
  { id: "q14", text: "Tidak ada pungutan liar dalam pelayanan" },
  { id: "q15", text: "Tidak ada praktik pencaloan dalam pelayanan" }
] as const;

export const ratingKeys = surveyQuestions.map((question) => question.id);
