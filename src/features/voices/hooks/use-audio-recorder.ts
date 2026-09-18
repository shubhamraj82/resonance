import {useRef, useState, useCallback, useEffect} from "react";
import type RecordRTCType from "recordrtc";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

export function useAudioRecorder(){
    const [isRecording,setIsRecording]=useState(false);
    const [elapsedTime,setElapsedTime]=useState(0);
    const [audioBlob,setAudioBlob]=useState<Blob|null>(null);
    const [error,setError]=useState<string|null>(null);

    const recorderRef=useRef<RecordRTCType|null>(null);
    const stremRef=useRef<MediaStream|null>(null);
    const timeRef=useRef<ReturnType<typeof setInterval>|null>(null);
    const containerRef=useRef<HTMLDivElement|null>(null);
    const wsRef=useRef<WaveSurfer|null>(null);
    const micStreamRef=useRef<{onDestroy:()=> void}|null>(null);

    const destroyWaveSurfer=useCallback(()=>{
        if(micStreamRef.current){
            micStreamRef.current.onDestroy();
            micStreamRef.current=null;
        }
        if(wsRef.current){
            wsRef.current.destroy();
            wsRef.current=null;
        }
    }, []);

    const cleanUp = useCallback(()=>{
        if(timeRef.current){
            clearInterval(timeRef.current);
            timeRef.current=null;
        }
        if(recorderRef.current){
            recorderRef.current.destroy();
            recorderRef.current=null;
        }
        if(stremRef.current){
            stremRef.current.getTracks().forEach(track=>track.stop());
            stremRef.current=null;
        }
        destroyWaveSurfer();
    },[destroyWaveSurfer]);

    useEffect(()=>{
        if(!isRecording || !containerRef.current || !stremRef.current) return;

        const ws=WaveSurfer.create({
            container:containerRef.current,
            waveColor:"hsl(var(--forground)/0.5)",
            height:144,
            barWidth: 1,
            barGap:2,
            barRadius:1,
            cursorWidth:0,
            barMinHeight:10,
            barHeight:2,
            normalize:true,
        });

        wsRef.current=ws;

        const record=ws.registerPlugin(
            RecordPlugin.create({
                scrollingWaveform:true,
            }),
        );

        const handle= record.renderMicStream(stremRef.current); 
        micStreamRef.current=handle;

        return ()=>{
            destroyWaveSurfer();
        }
       },[isRecording,destroyWaveSurfer]);

       const startRecording=useCallback(async()=>{
        try{
            setError(null);
            setAudioBlob(null);
            setElapsedTime(0);

            const stream = await navigator.mediaDevices.getUserMedia({audio:true});
            stremRef.current=stream;

            const {default:RecordRTC,StereoAudioRecorder} = await import(
                "recordrtc"
            );

            const recorder=new RecordRTC(stream,{
                recorderType:StereoAudioRecorder,
                mimeType:"audio/wav",
                numberOfAudioChannels:1,
                desiredSampRate:44100,
            });

            recorderRef.current=recorder;
            recorder.startRecording();
            setIsRecording(true);

            const startTime=Date.now();
            timeRef.current=setInterval(()=>{
                setElapsedTime(Math.floor((Date.now()-startTime)/1000));
            }, 1000)
        }catch(err){
            cleanUp();
            if(err instanceof DOMException && err.name === "NotAllowedError"){
                setError(
                    "Microphone access denied. Please allow microphone access in your browser settings",
                );
            }else{
                setError("Failed to access microphone. Please check your device settings and try again.");
            }
        }
       },[cleanUp]);

       const stopRecording = useCallback(
        (onBlob?:(blob:Blob)=>void):void=>{
            const recorder=recorderRef.current;
            if(!recorder) return;

            recorder.stopRecording(()=>{
                const blob=recorder.getBlob();
                setAudioBlob(blob);
                onBlob?.(blob);
                cleanUp();
                setIsRecording(false);
            });
        },
        [cleanUp],
       );

       const resetRecording=useCallback(()=>{
        cleanUp();
        setIsRecording(false);
        setElapsedTime(0);
        setAudioBlob(null);
        setError(null);
       },[cleanUp]);

       return {
        isRecording,
        elapsedTime,
        audioBlob,
        error,
        startRecording,
        stopRecording,
        resetRecording,
        containerRef,
       }
}