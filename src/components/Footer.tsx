export default function Footer() {
  return (
    <footer className="mt-auto border-t border-dark-800/60 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-accent" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
            </div>
            <span className="font-heading text-lg text-dark-300 tracking-wider">WATCHABLES</span>
          </div>
          <p className="text-dark-500 text-xs">
            Powered by{" "}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent transition-colors">
              TMDB
            </a>
            {" "}&{" "}
            <a href="https://www.vidking.net" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent transition-colors">
              Vidking
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
