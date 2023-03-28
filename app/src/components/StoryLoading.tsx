export function StoryLoading(props: { storyStart: boolean }): JSX.Element {
    if (props.storyStart) {
        return (
            <>
                <div className="uk-flex  uk-flex-center ">
                    <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-top">
                        <h1 className="uk-heading-small">Loading...</h1>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="uk-flex  uk-flex-center ">
                <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-top">
                    <h1 className="uk-heading-small">The fight continues...</h1>
                </div>
            </div>
        </>
    )
}
