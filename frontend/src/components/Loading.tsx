import LoadingBar from 'react-top-loading-bar'

interface LoadingProps{
    progress: number;
}

const Loading: React.FC<LoadingProps> = ({progress}) =>{


    return(
        <div>
            <LoadingBar
                color="#10B981" 
                progress={progress}
                height={5}    
            />
        </div>
    )
}
export default Loading;