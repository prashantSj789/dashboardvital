class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 text-red-600">
          <h1>Error Rendering Dashboard</h1>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <p>Check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}