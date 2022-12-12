import { atom } from "recoil";

export const taskDataAtom = atom({ key: 'taskData', default: null });
export const userDataAtom = atom({ key: 'userData', default: { email: null } });
export const judgeAtom = atom({ key: 'judgeData', default: {pair:null, selected:null, message:null, isDisplay: false} });