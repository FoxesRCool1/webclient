import { defineStore } from 'pinia'

import { Track } from '@/interfaces'

export default defineStore('track-selection', {
    state: () => ({
        selected: <Track[]>[],
        lastClickedIndex: <number | null>null,
    }),
    getters: {
        count(): number {
            return this.selected.length
        },
        isEmpty(): boolean {
            return this.selected.length === 0
        },
        isSelected() {
            return (trackhash: string) => this.selected.some(t => t.trackhash === trackhash)
        },
    },
    actions: {
        toggle(track: Track, index: number) {
            this.lastClickedIndex = index

            const existingIndex = this.selected.findIndex(t => t.trackhash === track.trackhash)

            if (existingIndex === -1) {
                this.selected.push(track)
                return
            }

            this.selected.splice(existingIndex, 1)
        },
        selectRange(tracks: Track[], fromIndex: number, toIndex: number) {
            const [start, end] = fromIndex <= toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex]

            for (let i = start; i <= end; i++) {
                const track = tracks[i]
                if (!track || !track.trackhash) continue
                if (this.selected.some(t => t.trackhash === track.trackhash)) continue

                this.selected.push(track)
            }
        },
        clear() {
            this.selected = []
            this.lastClickedIndex = null
        },
    },
})
