import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { BookType, Purchase, User } from "./types/types";
import { nextAuthOptions } from "./lib/next-auth/options";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;
  const { contents } = await getAllBooks();

  let purchasesData = [];
  let purchasedIds: number[] = [];

  // if (user) {
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`
  //   );

  //   purchasesData = await response.json();
  //   purchasedIds = purchasesData.map((purchase: Purchase) => purchase.bookId);
  // }

  return (
    <>
      <div className="relative w-full h-64 md:h-96">
        <Image
          src="/28480621_l.jpg"
          alt="Header Image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            - 全ての肉球に届け -
          </h1>
        </div>
      </div>

      <main className="flex flex-wrap justify-center items-center md:mt-16 mt-10">
        <h2 className="text-center w-full font-bold text-3xl mb-2">猫缶一覧</h2>
        {contents.map((book: BookType) => (
          <Book
            key={book.id}
            book={book}
            isPurchased={purchasedIds.includes(book.id)}
          />
        ))}
      </main>
    </>
  );
}
