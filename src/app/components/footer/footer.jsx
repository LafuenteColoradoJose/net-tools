export default function Footer() {
  return (
    <footer className="text-gray-300 bg-gray-800 body-font">
      <div className="container flex flex-col items-center gap-4 px-5 py-8 mx-auto sm:flex-row sm:justify-center">
        <div className="flex flex-row items-center justify-between gap-4">
          <a
            href="mailto:joselafuente77@gmail.com"
            className="text-xl font-medium text-gray-300 title-font"
          >
            José Lafuente
          </a>
          <p className="text-sm text-gray-400">© 2025</p>
        </div>

        <span className="inline-flex justify-center mt-4 sm:ml-auto sm:mt-0 sm:justify-start">
          <a
            href="https://www.linkedin.com/in/joselafuentecolorado/"
            target="_blank"
            className="ml-3 text-gray-500"
          >
            <svg
              fill="currentColor"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0"
              className="w-5 h-5 text-secondary hover:scale-105 hover:text-opacity-100 hover:text-terciary"
              viewBox="0 0 24 24"
            >
              <path
                stroke="none"
                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
              ></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
          <a
            href="https://github.com/LafuenteColoradoJose"
            target="_blank"
            className="ml-3 text-gray-500"
          >
            <svg
              fill="currentColor"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0"
              className="w-5 h-5 text-secondary hover:scale-105 hover:text-opacity-100 hover:text-terciary"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="none"
                d="M12 .5C5.372.5 0 5.872 0 12.5c0 5.299 3.438 9.8 8.207 11.388.6.111.793-.261.793-.579v-2.022c-3.338.724-4.033-1.617-4.033-1.617-.546-1.387-1.333-1.758-1.333-1.758-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.836 2.807 1.306 3.492.998.108-.774.418-1.307.76-1.607-2.665-.305-5.467-1.332-5.467-5.931 0-1.31.469-2.382 1.236-3.222-.124-.305-.536-1.534.117-3.195 0 0 1.008-.322 3.3 1.23a11.49 11.49 0 013.007-.403c1.02.005 2.046.137 3.007.403 2.291-1.552 3.297-1.23 3.297-1.23.656 1.661.243 2.89.119 3.195.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.623-5.479 5.921.43.372.816 1.102.816 2.221v3.293c0 .322.192.695.8.578C20.565 22.296 24 17.8 24 12.5 24 5.872 18.627.5 12 .5z"
              ></path>
            </svg>
          </a>
        </span>
      </div>
    </footer>
  );
}
