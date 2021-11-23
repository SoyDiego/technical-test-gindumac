import React, { useState } from "react";
import Error from "./Error";
import Loading from "./Loading";
import styled from "@emotion/styled";


//Style Component Form
const FormContainer = styled.form`
	display: flex;
	justify-content: center;
	width: 50%;
	padding: 1.5rem 0;
`;

const Input = styled.input`
	width: 100%;
	margin-right: 2rem;
	text-align: center;
	padding: 1rem;
	border: none;
	color: #ffffff;
	border-bottom: 2px solid #ffffff;
	background-color: transparent;
	font-family: "Noto Sans TC", sans-serif;
`;

const Button = styled.button`
	cursor: pointer;
	background-color: ${(props) => (props.danger ? "#ff6961" : "#FFFFFF")};
	color: ${(props) => (props.danger ? "#FFFFFF" : "#000000")};
	border: none;
	text-transform: uppercase;
	font-weight: bold;
	margin: 0 0.5rem;
	padding: 0.5rem 1.5rem;
`;

//End Style Component Form

const Form = ({ e, setDataApi, setDataApiRepos }) => {
	const [info, setInfo] = useState({
		user: "",
	});

	const [showloading, setShowLoading] = useState(false);

	const [error, setError] = useState({
		active: false,
		message: "",
	});

	const inputUser = (e) => {
		setInfo({
			[e.target.name]: e.target.value,
		});
	};

	const { user } = info;
	const { active, message } = error;

	const handleForm = (e) => {
		e.preventDefault();

		//Validate
		if (user === "") {
			//Show Error
			setError({
				active: true,
				message: "User is required.",
			});
			return;
		}
		setError({
			active: false,
			message: "",
		});

		//Api Call
		(async () => {
			setShowLoading(true);
			const json = await fetch("https://api.github.com/users/" + user);
			const data = await json.json();

			if (data.message === "Not Found") {
				setShowLoading(false);
				setError({
					active: true,
					message: user + " does not exist.",
				});
				return;
			}

			setError({
				active: false,
				message: "",
			});

			setDataApi({
				avatar: data.avatar_url,
				bio: data.bio,
				name: data.name,
				username: data.login,
			});

			(async () => {
				const json = await fetch(
					"https://api.github.com/users/" +
						user +
						"/repos?sort=created"
				);
				const data = await json.json();

				setShowLoading(false);
				setDataApiRepos(data);
			})();
		})();

		//Clean Form
		e.target.reset();
	};
	return (
		<>
			<div>
				<a href="/noWhere">
					<Button danger>LINK TO NOWHERE</Button>
				</a>
				<a href="/credits">
					<Button>CREDITS</Button>
				</a>
			</div>

			<FormContainer onSubmit={handleForm}>
				<Input
					type="text"
					name="user"
					placeholder="Search GitHub user..."
					onChange={inputUser}
				/>

				<Button type="submit">Search</Button>
			</FormContainer>

			{active && <Error message={message}></Error>}

			{showloading && <Loading />}
		</>
	);
};
export default Form;
