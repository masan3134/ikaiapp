"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Tag, AlertCircle, Info, CheckCircle } from "lucide-react";
import { getArticle } from "../content";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const article = getArticle(slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Makale Bulunamadı
            </h1>
            <p className="text-slate-600 mb-6">
              Aradığınız makale mevcut değil veya kaldırılmış olabilir.
            </p>
            <button
              onClick={() => router.push("/help")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Yardım Merkezine Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/help")}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Yardım Merkezine Dön
        </button>

        {/* Article Header */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {article.category}
            </span>
            <span className="text-sm text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Son güncelleme: {new Date(article.lastUpdated).toLocaleDateString("tr-TR")}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            {article.title}
          </h1>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="prose prose-slate max-w-none">
            {article.content.map((block, index) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p key={index} className="text-slate-700 mb-4 leading-relaxed">
                      {block.content}
                    </p>
                  );

                case "heading":
                  if (block.level === 2) {
                    return (
                      <h2
                        key={index}
                        className="text-2xl font-bold text-slate-800 mt-8 mb-4"
                      >
                        {block.content}
                      </h2>
                    );
                  } else {
                    return (
                      <h3
                        key={index}
                        className="text-xl font-semibold text-slate-800 mt-6 mb-3"
                      >
                        {block.content}
                      </h3>
                    );
                  }

                case "list":
                  return (
                    <ul key={index} className="space-y-2 mb-6 ml-6">
                      {block.items?.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-slate-700 flex gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );

                case "code":
                  return (
                    <pre
                      key={index}
                      className="bg-slate-900 text-slate-100 p-4 rounded-lg mb-6 overflow-x-auto"
                    >
                      <code>{block.content}</code>
                    </pre>
                  );

                case "alert":
                  const alertStyles = {
                    info: "bg-blue-50 border-blue-200 text-blue-800",
                    warning: "bg-amber-50 border-amber-200 text-amber-800",
                    success: "bg-green-50 border-green-200 text-green-800",
                  };
                  const alertIcons = {
                    info: <Info className="w-5 h-5 text-blue-600" />,
                    warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
                    success: <CheckCircle className="w-5 h-5 text-green-600" />,
                  };

                  return (
                    <div
                      key={index}
                      className={`flex gap-3 p-4 rounded-lg border mb-6 ${
                        alertStyles[block.variant || "info"]
                      }`}
                    >
                      {alertIcons[block.variant || "info"]}
                      <p className="flex-1">{block.content}</p>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </div>

        {/* Footer - Contact Support */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <p className="text-slate-700 mb-3">
            Bu makale yardımcı oldu mu? Başka bir konuda yardıma mı ihtiyacınız var?
          </p>
          <div className="flex gap-4">
            <a
              href="mailto:support@gaiai.ai"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
            >
              Destek Ekibine Ulaş
            </a>
            <button
              onClick={() => router.push("/help")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Diğer Makaleleri Gör
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
