function Main(props) {
    const user = JSON.parse(localStorage.getItem("loginUser"));

    return (
        <div>
            <h1>메인 화면</h1>

            {user && (
                <>
                    <p>환영합니다, {user.nickname} 님 👋</p>
                </>
            )}
        </div>
    );
}

export default Main;