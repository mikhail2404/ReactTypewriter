import React, {useState, useEffect} from 'react';

import styles from './Typewriter.module.css';

const DEFAULT_MS = 30;

export interface ITypewriterProps {
    text: string | string[];
    speed?: number;
    loop?: boolean;
    newLine?: boolean;
    random?: number;
    delay?: number;
    cursor?: boolean;
    onFinished?: Function;
    onStart?: Function;
}

export default function Typewriter({
       text,
       speed = DEFAULT_MS,
       loop = false,
       newLine = false,
       random = DEFAULT_MS,
       delay = DEFAULT_MS,
       cursor = true,
       onFinished = () => {
       },
       onStart = () => {
       }
    }: ITypewriterProps) {

    const [currentStringIndex, setCurrentStringIndex] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [lines, setLines] = useState<string[]>([text[0]]);

    if (!Array.isArray(text))
        text = [text]

    useEffect(() => {
        setTimeout(async () => {
            if (currentTextIndex === 0)
                onStart();

            if (currentTextIndex < text[currentStringIndex].length) {
                setCurrentTextIndex(currentTextIndex + 1);
            } else {
                if (currentStringIndex < text.length - 1) {
                    await nextLine()
                }
                else {
                    if (loop) {
                        setTimeout(() => {
                            setCurrentTextIndex(0);
                            setCurrentStringIndex(0);
                            setLines([text[0]])
                        }, delay);
                    } else {
                        onFinished();
                    }
                }
            }
        }, speed + (Math.random() * random));
    });
    const waitForDelay = (milisec: number) => {
        return new Promise(resolve => {
            setTimeout(() => {

                resolve('')
            }, milisec);
        })
    }

    const typeWrite  = async (str: string) => {
        for(let i = 0; i < str.length; i++){
            await waitForDelay(speed + (Math.random() * random))
            setCurrentTextIndex(i)
        }
    }

    const nextLine = async () => {
        await waitForDelay(delay)
        setCurrentTextIndex(0);
        setCurrentStringIndex(currentStringIndex + 1);
        console.log({currentStringIndex})
        setLines(lines => [...lines, text[currentStringIndex + 1]]);
    }

    if (Array.isArray(text) && newLine && delay) {
        return (
            <>
                {lines.map((line, index) => (
                    <span key={line}>
                            {
                                line === text[currentStringIndex]  ? line.substring(0, currentTextIndex) : line
                            }
                            {currentStringIndex !== index && <br />}
                    </span>
                    )
                )}
                <span className={styles.cursor}>
                {
                    cursor && '▎'
                }
                </span>
            </>
        )
    }


    return (
        <span>
            {
                text[currentStringIndex].substring(0, currentTextIndex)
            }
            <span className={styles.cursor}>
            {
                cursor && '▎'
            }
            </span>
        </span>
    );
}