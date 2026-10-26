import {useRef,useState} from 'react';
import {addAward,heroStats,readHero,saveHero} from './campaign';
export function useHero(){const [hero,setHero]=useState(readHero),current=useRef(hero),[warning,setWarning]=useState('');function award(id:string){const next=addAward(current.current,id);if(next===current.current)return;current.current=next;if(!saveHero(next))setWarning('浏览器未能保存经验，本次仍可继续游戏。');setHero(next);}return {...heroStats(hero),warning,award};}
