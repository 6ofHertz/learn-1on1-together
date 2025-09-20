import React, { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/useDebounce"
import { motion, AnimatePresence } from "framer-motion"

interface LessonSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export const LessonSearch = ({ onSearch, placeholder = "Search lessons..." }: LessonSearchProps) => {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)

  // Call onSearch when debounced query changes
  React.useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <motion.div 
      className="relative max-w-md mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 py-2 rounded-full border-2 focus:border-primary transition-colors"
        />
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 w-6 p-0 hover:bg-transparent"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}