
function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground transition-colors duration-200">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-2 text-center">
          AI Career Twin
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Your production-grade career optimization copilot is spinning up.
        </p>
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    </div>
  );
}

export default App;
