"use client";

import { getDetailBook } from "@/app/lib/microcms/client";
import Loading from "@/app/loading";
import { BookType } from "@/app/types/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const modalStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed" as "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: "1000",
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  zIndex: "1001",
};

const DetailBook = ({ params }: { params: { id: string } }) => {
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();
  const user: any = session?.user;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const fetchedBook = await getDetailBook(params.id);
        setBook(fetchedBook);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  if (loading) {
    return <Loading />;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  //stripe checkout
  const startCheckout = async (bookId: number) => {
    console.log("startCheckoutです");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId,
            title: book.title,
            price: book.price,
            userId: user?.id,
          }),
        }
      );

      const responseData = await response.json();

      if (responseData && responseData.checkout_url) {
        sessionStorage.setItem("stripeSessionId", responseData.session_id);

        //チェックアウト後のURL遷移先
        router.push(responseData.checkout_url);
      } else {
        console.error("Invalid response data:", responseData);
      }
    } catch (err) {
      console.error("Error in startCheckout:", err);
    }
  };

  const handlePurchaseConfirm = () => {
    if (!user) {
      setShowModal(false);
      router.push("/login");
    } else {
      //Stripe購入画面へ。購入済みならそのまま本ページへ。
      startCheckout(book.id);
    }
  };

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleBack = () => {
    router.back();
  };

  const formattedPrice = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(book.price);

  const formatContent = (content: string) => {
    return { __html: content.replace(/\n/g, "<br>") };
  };

  return (
    <div className="container mx-auto p-4 mt-8 mb-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <Image
          className="w-full h-80 object-cover object-center"
          src={book.thumbnail.url}
          alt={book.title}
          width={700}
          height={700}
        />
        <div className="p-4">
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              公開日: {new Date(book.createdAt).toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              最終更新: {new Date(book.updatedAt).toLocaleString()}
            </span>
          </div>
          <h2 className="text-3xl font-bold mt-5">{book.title}</h2>
          <div
            className="text-gray-700 mt-10 mb-20"
            dangerouslySetInnerHTML={formatContent(book.content)}
          />

          <div className="flex justify-center items-center space-x-2">
            <p className="text-3xl text-red-600">{formattedPrice}</p>
            <p className="text-gray-400">+送料500円</p>
          </div>

          <div className="flex justify-center items-center mt-14 mb-14">
            <button
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4 text-lg"
            >
              戻る
            </button>
            <button
              onClick={handleOpen}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded text-lg"
            >
              購入する
            </button>
          </div>

          {showModal && (
            <div style={modalStyle}>
              <div style={modalContentStyle}>
                <h3 className="text-xl mb-4">この猫缶を購入しますか？</h3>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4"
                >
                  キャンセル
                </button>
                <button
                  onClick={handlePurchaseConfirm}
                  className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded "
                >
                  購入する
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailBook;
