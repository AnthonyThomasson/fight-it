export function StoryStart(props: { onStoryStart: () => void }): JSX.Element {
    return (
        <>
            <div className="uk-flex  uk-flex-center ">
                <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-top">
                    <h1 className="uk-heading-small">FIGHT IT</h1>
                    <p>
                        Select the option to &#34;Attack&#34; or
                        &#34;Defend&#34;, then adjust the effort slider. The
                        more effort you put into an action the higher chance you
                        will get tired in the round. The more tired you are the
                        more prone you are to damage and injury. Enter a
                        strategy you want to take when fighting in the next
                        round. You can pick any strategy you want but it must be
                        something that is physically possible for a boxer to do.
                    </p>
                    <button
                        className="uk-button uk-button-default"
                        onClick={props.onStoryStart}
                    >
                        Fight !
                    </button>
                </div>
            </div>
        </>
    )
}
