// mbti 이벤트 질문 리스트
export const questions = [
    {
        id:1, 
        question: '산책을 할 떄 나는 ?',
        options:[
            {text: '미리 계획을 세우고 준비한다', type:'J'},
            {text: '일단 나가고 본다', type:'P'},
        ]
    },
    {
        id:2, 
        question: '산책 도중 내 반려동물과 다른 반려동물이 인사를 하고 있다.\n상대 보호자에게 나는 ?',
        options:[
            {text: '먼저 말을 건다', type:'E'},
            {text: '상대가 말을 걸 때까지 내 반려동물만 본다.', type:'I'},
        ]
    },
    {
        id:3, 
        question: '친구가 자기 동물에 대한 상담을 하고 있다. 그 떄의 나는 ?',
        options:[
            {text: '해결책을 찾으려 노력한다', type:'T'},
            {text: '당장 힘든 친구의 마음을 다독여준다.', type:'F'},
        ]
    },
    {
        id:4, 
        question: '평소 나는 ?',
        options:[
            {text: '내 반려동물이 괴물이 된다면... 이라는 상상을 해봤다', type:'N'},
            {text: '당장 어떻게 키울지에 대한 생각만 한다', type:'S'},
        ]
    },   
]