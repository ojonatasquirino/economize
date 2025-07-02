"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  icon?: React.ReactNode
  className?: string
}

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
  icon,
  className,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className={cn("bg-black border-white/10", className)}>
      <CardHeader className="pb-3">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between p-0 h-auto text-left hover:bg-transparent"
        >
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-white/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/60" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  )
}
