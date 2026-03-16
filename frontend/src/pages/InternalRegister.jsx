import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function InternalRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const validateForm = () => {
    const { email, password, confirmPassword } = form;

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{12,}$/;

    if (!passwordRegex.test(password)) {
      return "Password must be 12+ chars with upper, lower, number & special character";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auth/internal/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        }
      );

      alert("Internal User Registered Successfully");
      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Internal Account</h2>
        <p className="register-subtitle">
          Register a new system user
        </p>

        {error && <div className="register-error">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            className="register-input"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            className="register-input"
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            className="register-input"
            name="password"
            type="password"
            placeholder="Strong Password"
            onChange={handleChange}
            required
          />

          <input
            className="register-input"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          <select
  name="role"
  className="form-control"
  onChange={handleChange}
  required
>
  <option value="">Select Role</option>
  <option value="ADMIN">Admin</option>
  <option value="PLANNER">Planner</option>
  <option value="SUPERVISOR">Supervisor</option>
  <option value="PRODUCTION">Production</option>
  <option value="OPERATOR">Operator</option>
</select>

          <button className="register-btn" type="submit">
            Register User
          </button>
        </form>

        <p className="register-footer">
          Already registered?
          <span onClick={() => navigate("/")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default InternalRegister;