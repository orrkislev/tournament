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
import { adminEmails } from "../components/AdminUserSelect";

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
  font-size: 0.8rem;
  transition: all 0.15s ease-in-out;
  &:hover {
	  background-color: #eee;
	  padding-right: 2rem;
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


export default function Home() {
	const [user, setUser] = useRecoilState(userDataAtom)
	const [ownTasks, setOwnTasks] = useState([]);
	const [answers, setAnswers] = useState([]);

	useEffect(() => {
		if (!user) {
			setUser(getUser())
			return
		}
		const q = query(collection(firestore, "tasks"), where("author", "==", user.uid));
		getDocs(q).then((querySnapshot) => {
			const docs = [];
			querySnapshot.forEach((doc) => {
				docs.push({ ...doc.data(), id: doc.id });
			})
			docs.sort((a, b) => a.lastUpdate < b.lastUpdate ? 1 : -1)
			docs.sort((a, b) => a.lastUpdate == undefined ? 1 : -1)

			setOwnTasks(docs);
		});
		const q2 = query(collection(firestore, "tasks"), where("answers." + user.uid, "!=", ""));
		getDocs(q2).then((querySnapshot) => {
			const docs = [];
			querySnapshot.forEach((doc) => {
				docs.push({ taskID: doc.id, taskTitle: doc.data().title });
			})
			setAnswers(docs);
		});
	}, [user])

	const router = useRouter()

	function gotoAnswer(id) {
		router.push(`/task?id=${id}`)
	}
	function newTask() {
		router.push(`/create`)
	}

	return (
		<IndexList>
			{user.admin && (
				<>
					<ListItem onClick={newTask}>
						<ListItemRight>
							<ListItemTitle>Create new task</ListItemTitle>
						</ListItemRight>
					</ListItem>
					{ownTasks.map((doc) => (
						<IndexOwnedTask doc={doc} key={doc.id} />
					))}
				</>
			)}

			{answers.map((doc, docIndex) => (
				<ListItem key={docIndex} onClick={() => gotoAnswer(doc.taskID)}>
					<ListItemRight>
						<ListItemTitle>{doc.taskTitle}</ListItemTitle>
					</ListItemRight>
				</ListItem>
			))}
		</IndexList>
	)
}

function IndexOwnedTask({ doc }) {
	const router = useRouter()
	const numAnswers = Object.keys(doc.answers).length
	function gotoTask(id) {
		router.push(`/task?id=${id}`)
	}

	return (
		<ListItem onClick={() => gotoTask(doc.id)}>
			<ListItemRight>
				{/* {doc.lastUpdate ? doc.lastUpdate.toDate().toLocaleDateString() : ""} */}
				<ListItemTitle>{doc.title}</ListItemTitle>
				<div>{doc.text}</div>
			</ListItemRight>
			<ListItemLeft>
				<div>
					{numAnswers == 0 ?
						`אף אחד עדיין לא ענה על השאלון.`
						: numAnswers == 1 ?
							`ענה עד כה אחד על השאלה`
							: `ענו עד כה ${numAnswers} על השאלה`
					}
				</div>
			</ListItemLeft>
		</ListItem>
	)
}