import { ChangeEvent, FormEvent, useContext, useState } from "react";
import regex from "../../resources/regex";
import { ChatContext } from "../../context/ChatContext";

const LoginForm = () => {
  const { send } = useContext(ChatContext)!;
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateUserData = () => {
    const trimmedPassword = formData.password.trim();
    const trimmedUsername = formData.username.trim();

    return (
      regex.usernameRegex.test(trimmedUsername) &&
      regex.passwordRegex.test(trimmedPassword)
    );
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateUserData()) {
      return;
    }
    send({
      event: "authorization",
      payload: { name: formData.username, password: formData.password },
    });
  };

  return (
    <section className="w-screen h-screen flex justify-center items-center flex-col">
      <form
        onSubmit={(e) => onSubmit(e)}
        className="flex flex-col w-[300px] border-periwinkleGray border p-4 m-1 rounded-lg"
      >
        <div className="mb-10">
          <h2 className="font-extrabold text-2xl">Login</h2>
          <p className="font-light leading-4 mt-2">
            Enter your credentials to access your account.
          </p>
        </div>
        <label className="font-light" htmlFor="username">
          Username
        </label>
        <input
          className="bg-aliceBlue border-hippieBlue border rounded-xl py-1 px-2 mt-2"
          name="username"
          type="text"
          onChange={(e) => onChange(e)}
        />
        <label className="font-light mt-5" htmlFor="password">
          Password
        </label>
        <input
          className="bg-aliceBlue border-hippieBlue border rounded-xl py-1 px-2 mt-2"
          name="password"
          type="password"
          onChange={(e) => onChange(e)}
        />
        <button
          type="submit"
          className="mt-12 bg-vanillaIce font-light p-2 rounded-xl hover:brightness-110 active:brightness-75 duration-300"
        >
          Log in
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
