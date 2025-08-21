import React from "react";
import { format, parseISO } from "date-fns"; 
import { ja } from "date-fns/locale"; 

export const ArticlesTable = ({ articles, onSort, sort, order }) => {
  // 本文をカット（40文字）
  const truncate = (text, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "…" : text;
  };

  return (
    <div style={{ flex: 1, overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          tableLayout: "fixed", 
        }}
      >
        <thead>
          <tr style={{ background: "#f9fafb", textAlign: "left" }}>
            <th style={{ padding: "12px", width: "32%" }}>タイトル</th>
            <th style={{ padding: "12px", width: "47%" }}>本文</th>
            <th
              style={{ padding: "12px", width: "15%", cursor: "pointer" }}
              onClick={() => onSort("published_at")}
            >
              公開日{" "}
              {sort === "published_at" ? (order === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              style={{ padding: "12px", width: "6%", cursor: "pointer"}}
              onClick={() => onSort("pv")}
            >
              PV {sort === "pv" ? (order === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <tr key={article.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {article.title}
                </td>
                <td style={{ padding: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {truncate(article.body, 40)}
                </td>
                <td style={{ padding: "12px" }}>
                  {format(parseISO(article.published_at), "yyyy年M月d日", { locale: ja })}
                </td>
                <td style={{ padding: "12px", textAlign: "left" }}>{article.pv}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "16px" }}>
                記事が見つかりません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
