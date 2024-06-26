import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [

  {
    heading: 'Optimize Your Rental Revenue',
    message: 'Optimize Your Rental Revenue'
  },
  {
    heading: 'Unleash Your Rental’s Potential',
    message: 'Unleash Your Rental’s Potential'
  },
  {
    heading: 'Revolutionize F&B Operations with AI Assistants',
    message: 'Revolutionize F&B Operations with AI Assistants'
  },
  {
    heading: 'Unveil AI’s Logic and Evolve Together',
    message: 'Unveil AI’s Logic and Evolve Together'
  },
  {
    heading: 'Optimize Menu Offerings with AI Insights',
    message: 'Optimize Menu Offerings with AI Insights.'
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
