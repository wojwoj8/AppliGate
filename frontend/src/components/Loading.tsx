import LoadingBar from 'react-top-loading-bar'

interface LoadingProps{
    progress: number;
}

const Loading: React.FC<LoadingProps> = ({progress}) =>{


    return(
        <div>
            <LoadingBar
                color="#10B981"   // Set your desired color
                progress={progress}
                height={5}         // Set the height of the loading bar
            />
        </div>
    )
}
export default Loading;