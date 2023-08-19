import { QuestionCard } from "@/components/ui/question-card";
import { PropsWithChildren } from "react";
export default function Page({ children }: PropsWithChildren) {
    return <div className="container grid grid-cols-1 gap-7 mt-10">
        <QuestionCard title="Question" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."></QuestionCard>
        <QuestionCard title="Question" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."></QuestionCard>
        <QuestionCard title="Question" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."></QuestionCard>
        <QuestionCard title="Question" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."></QuestionCard>
        <QuestionCard title="Question" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."></QuestionCard>
        <QuestionCard title="Question" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."></QuestionCard>
        <QuestionCard title="Question" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."></QuestionCard>
        <QuestionCard title="Question" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."></QuestionCard>

    </div>

}