import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import Button from "../components/Button";
import { useLoginMutation, useRegisterMutation } from "../api/api";
import { selectIsAuthenticated, setCredentials } from "../store/authSlice";
import { parseApiError } from "../utils/apiError";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientErrors, setClientErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginMutation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function validateForm() {
    const errors = {};
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 60) {
      errors.name = "Le nom doit contenir entre 2 et 60 caractères.";
    }
    if (!email.trim().includes("@")) {
      errors.email = "Adresse e-mail invalide.";
    }
    if (password.length < 10) {
      errors.password = "10 caractères minimum.";
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      errors.password = "Doit contenir au moins une lettre et un chiffre.";
    }
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    const cleanEmail = email.trim();
    const cleanName = name.trim();

    try {
      // 1. Création du compte
      await registerUser({ name: cleanName, email: cleanEmail, password }).unwrap();

      // 2. Connexion automatique avec les mêmes identifiants
      const authData = await loginUser({ email: cleanEmail, password }).unwrap();
      dispatch(setCredentials({ token: authData.token, user: authData.user }));
      setPassword("");
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(parseApiError(err));
    }
  }

  const isBusy = isRegistering || isLoggingIn;

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-night/15 bg-cream p-6 sm:p-8">
        <SectionTitle title="Inscription" subtitle="Créez votre compte client Art DZ" />

        {serverError && (
          <div role="alert" className="mb-4 rounded-xl bg-terracotta/15 p-3 text-sm font-medium text-terracotta">
            {serverError.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="reg-name" className="block text-sm font-bold">
              Nom complet
            </label>
            <input
              id="reg-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-4"
            />
            {(clientErrors.name || serverError?.fieldErrors?.name) && (
              <p className="mt-1 text-xs text-terracotta">
                {clientErrors.name || serverError.fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-bold">
              Adresse e-mail
            </label>
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-4"
            />
            {(clientErrors.email || serverError?.fieldErrors?.email) && (
              <p className="mt-1 text-xs text-terracotta">
                {clientErrors.email || serverError.fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-bold">
              Mot de passe
            </label>
            <input
              id="reg-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-4"
            />
            <p className="mt-1 text-xs text-night/70">
              Minimum 10 caractères, avec au moins une lettre et un chiffre.
            </p>
            {(clientErrors.password || serverError?.fieldErrors?.password) && (
              <p className="mt-1 text-xs text-terracotta">
                {clientErrors.password || serverError.fieldErrors.password}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isBusy} className="w-full">
            {isBusy ? "Création du compte..." : "S'inscrire"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          Déjà inscrit ?{" "}
          <Link to="/connexion" className="font-bold text-terracotta hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </Container>
  );
}

export default Register;
