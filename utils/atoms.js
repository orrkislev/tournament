import { atom } from "recoil";

export const taskDataAtom = atom({ key: 'taskData', default: null });
export const userDataAtom = atom({ key: 'userData', default: { email: null } });
export const nextJudgeAtom = atom({ key: 'nextJudgeFlag', default: 0 });