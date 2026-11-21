import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import Button from "../components/Button";
import { useLoginMutation } from "../api/api";
import { selectIsAuthenticated, setCredentials } from "../store/authSlice";
import { parseApiError } from "../utils/apiError";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState(null);

  const [login, { isLoading }] = useLoginMutation();
  const redirectTo = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);

    try {
      const data = await login({ email: email.trim(), password }).unwrap();
      dispatch(setCredentials({ token: data.token, user: data.user }));
      setPassword("");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(parseApiError(err));
    }
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-night/15 bg-cream p-6 sm:p-8">
        <SectionTitle title="Connexion" subtitle="Accédez à votre compte Art DZ" />

        {serverError && (
          <div role="alert" className="mb-4 rounded-xl bg-terracotta/15 p-3 text-sm font-medium text-terracotta">
            {serverError.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-bold">
              Adresse e-mail
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-4"
            />
            {serverError?.fieldErrors?.email && (
              <p className="mt-1 text-xs text-terracotta">{serverError.fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-bold">
              Mot de passe
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-4"
            />
            {serverError?.fieldErrors?.password && (
              <p className="mt-1 text-xs text-terracotta">{serverError.fieldErrors.password}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="font-bold text-terracotta hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </Container>
  );
}

export default Login;
