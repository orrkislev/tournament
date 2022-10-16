import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { userDataAtom } from "../utils/atoms";
import { auth, firestore, getUser, readDoc } from "../utils/firebaseConfig";

import { Grid, Card } from "@mui/material";
import styled from "styled-components";
import { SimpleLink, SimpleTitle } from "../styles/Styles";

const IndexList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  `;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid white;
  padding: 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
	  border-bottom: 4px solid white;
	}
  `;
const ListItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  `;
const ListItemRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  `;
const ListItemTitle = styled.div`
  font-weight: bold;
  `;
const ListItemText = styled.div`
  font-size: 0.8rem;
  `;


export default function Home() {
	// const user = useRecoilValue(userDataAtom)
	const [user, setUser] = useRecoilState(userDataAtom)
	const [ownTasks, setOwnTasks] = useState([]);
	const [answers, setAnswers] = useState([]);

	useEffect(() => {
		if (!user) {
			setUser(getUser())
			return
		}
		const q = query(collection(firestore, "tasks"), where("author", "==", user.email));
		getDocs(q).then((querySnapshot) => {
			const docs = [];
			querySnapshot.forEach((doc) => {
				docs.push({ ...doc.data(), id: doc.id });
			})
			setOwnTasks(docs);
		});
		const q2 = query(collection(firestore, "tasks"), where("answers." + user.email, "!=", ""));
		getDocs(q2).then((querySnapshot) => {
			const docs = [];
			querySnapshot.forEach((doc) => {
				docs.push({ taskID: doc.id, taskTitle: doc.data().title });
			})
			setAnswers(docs);
		});
	}, [user])

	const router = useRouter()
	function gotoTask(id) {
		router.push(`/task?id=${id}`)
	}
	function gotoAnswer(id) {
		router.push(`/task?id=${id}`)
	}
	function newTask() {
		router.push(`/create`)
	}

	return (
		<IndexList>
			<IndexList>
				<SimpleTitle>My Tasks</SimpleTitle>
				<ListItem onClick={newTask}>
					<ListItemLeft>
						<ListItemTitle>Create new task</ListItemTitle>
					</ListItemLeft>
				</ListItem>
				{ownTasks.map((doc) => (
					<ListItem key={doc.id} onClick={() => gotoTask(doc.id)}>
						<ListItemLeft>
							<ListItemTitle>{doc.title}</ListItemTitle>
							<ListItemText>{doc.text}</ListItemText>
						</ListItemLeft>
						<ListItemRight>
						</ListItemRight>
					</ListItem>
				))}
			</IndexList>

			<IndexList>
				<SimpleTitle>My Answers</SimpleTitle>
				{answers.map((doc, docIndex) => (
					<div key={docIndex} onClick={() => gotoAnswer(doc.taskID)}>{doc.taskTitle}</div>
				))}
			</IndexList>
		</IndexList>
	)
}
