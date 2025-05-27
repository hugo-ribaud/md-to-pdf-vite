function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Markdown to PDF Converter
        </h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
            <p className="text-muted-foreground mb-4">
              Your Markdown to PDF converter is ready with Tailwind CSS v4.1.7
              and the latest dependencies.
            </p>
            <div className="flex gap-2">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Get Started
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
