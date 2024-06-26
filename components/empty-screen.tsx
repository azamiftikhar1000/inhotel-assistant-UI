import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [

  {
    heading: 'Are we on track with our guest satisfaction and RevPAR goals?',
    message: 'Are we on track with our guest satisfaction and RevPAR goals?',
  },
  {
    heading: 'Develop a tailored strategy to drive direct bookings.',
    message: 'Develop a tailored strategy to drive direct bookings.'
  },
  {
    heading: 'Are our restaurant menus optimally structured for our guests?',
    message: 'Are our restaurant menus optimally structured for our guests?',
  },
  {
    heading: 'Which revenue management system would be best suited for our operation?',
    message: 'Which revenue management system would be best suited for our operation?'

  },
   { 
    heading:'Organize introductory meetings with the top 3 consultants for marketing.',
  message:'Organize introductory meetings with the top 3 consultants for marketing.'

  },
  {
    heading: 'Emergency, we need to evacuate!',
    message: 'Emergency, we need to evacuate!'
  },
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
