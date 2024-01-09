"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PurchaseSuccess = () => {
  const [bookUrl, setBookUrl] = useState(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchData = async () => {
      if (sessionId) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/checkout/success`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            }
          );
          const data = await response.json();
          console.log("Response data:", data);

          if (data && data.purchase && data.purchase.bookId) {
            setBookUrl(data.purchase.bookId);
          } else {
            console.error("Book ID not found in response");
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();
  }, [sessionId]);

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
          購入ありがとうございます！
        </h1>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-14">
          商品がお手元に届くまで今しばらくお待ちください。
        </h1>
        <p className="text-center text-gray-600 ">
          ご購入いただいた商品内容の詳細は、プロフィール欄からでも確認できます。
        </p>
        <div className="mb-10">
          {bookUrl ? (
            <div className="mt-6 text-center">
              <Link
                href={`/book/${bookUrl}`}
                className="text-indigo-600 hover:text-indigo-800 transition duration-300"
              >
                購入した商品を見る
              </Link>
            </div>
          ) : (
            <p className="text-center text-gray-600">商品情報の読み込み中...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
