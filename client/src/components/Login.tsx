import { useAuthContext } from "context/AuthContext";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

interface Props {}

const Login = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthContext();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "green" }}>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}
      >
        <div>
          <label htmlFor='email'>
            Email:{" "}
            <input type='email' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>

        <div>
          <label htmlFor='password'>
            Password:{" "}
            <input
              type='password'
              name='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button type='submit'>Login</button>
        </div>
        <div>
          <small>
            Don't have an account? <Link to='/register'> Register</Link>
          </small>
        </div>
      </form>
    </div>
  );
};

export default Login;
