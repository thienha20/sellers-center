import type { NextFetchEvent, NextRequest } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    //check cookie hub cấp session cho login hub
    //...todo
    //--end check

    //return new Response() //khong can thiet
}