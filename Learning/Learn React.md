# Learn React

## 📘 Basics

### Hello World
```jsx
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<h1>Hello, React!</h1>, document.getElementById('root'));
```

### Components
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

## ⚛️ Intermediate

### useState Hook
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useEffect Hook
```jsx
import { useEffect } from 'react';

useEffect(() => {
  console.log('Component mounted');
}, []);
```

## 🚀 Advanced

### Context API
```jsx
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

### Custom Hooks
```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}
```

