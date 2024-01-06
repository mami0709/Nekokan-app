import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { BookType, Purchase, User } from "./types/types";
import { nextAuthOptions } from "./lib/next-auth/options";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  // userがundefinedの場合、処理を早期に終了する
  if (!user) {
    // ユーザーがいない場合の適切な処理をここに記述
    // 例: ログインページへリダイレクト、エラーメッセージの表示、等
    return <div>No user found</div>;
  }

  const { contents } = await getAllBooks();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`
  );

  const purchasesData = await response.json();
  const purchasedIds = purchasesData.map(
    (purchase: Purchase) => purchase.bookId
  );

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {contents.map((book: BookType) => (
          <Book
            key={book.id}
            book={book}
            // user={user}
            isPurchased={purchasedIds.includes(book.id)}
          />
        ))}
      </main>
    </>
  );
}
