import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex-1 flex flex-col pb-4">
      <div className="flex-1 w-full mx-auto bg-ink-5 rounded-3xl px-6 md:px-12 py-8 md:py-16 flex flex-col justify-center">
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-6 items-center">
          <img
            src="/assets/illustration4.svg"
            alt=""
            className="w-full max-w-[280px] justify-self-start"
          />
          <div className="col-span-2 row-span-2 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-h1 mb-12">
              Proto-Indo European
              <br />
              Etymology Made Easy
            </h1>
            <p className="text-body-md mb-4 font-bold">
              Try our flashcard app!
            </p>
            <Link
              to="/auth"
              className="btn bg-ink-100 text-white rounded-full px-12 hover:bg-ink-80 border-0"
            >
              Get started
            </Link>
          </div>
          <img
            src="/assets/illustration5.svg"
            alt=""
            className="w-full max-w-[200px] justify-self-end"
          />
          <img
            src="/assets/illustration6.svg"
            alt=""
            className="w-full max-w-[280px] justify-self-start"
          />
          <img
            src="/assets/illustration7.svg"
            alt=""
            className="w-full max-w-[200px] justify-self-end"
          />
        </div>

        {/* Mobile stacked */}
        <div className="md:hidden flex flex-col items-center text-center">
          <img
            src="/assets/illustration4.svg"
            alt=""
            className="w-48 mb-8"
          />
          <h1 className="text-h1 mb-8">
            Proto-Indo European Etymology Made Easy
          </h1>
          <p className="text-body-md mb-6 font-bold">Try our flashcard apps!</p>
          <Link
            to="/auth"
            className="btn bg-ink-100 text-white rounded-full px-12 w-full hover:bg-ink-80 border-0 mb-12"
          >
            Get started
          </Link>
          <img src="/assets/illustration6.svg" alt="" className="w-48" />
        </div>
      </div>
    </div>
  );
}
