 import { Friends } from "@/classes/Friends";
 import { Follows } from "@/classes/Follows";
 import { Groups } from "@/classes/Groups";


export function getUserFriends(user_id:any){
    // Get supabase client for direct queries
   
    const friendsClass = new Friends();
    try {
        return friendsClass.getFriends(user_id);
    }
    catch (error) {
        console.error("Error fetching friends:", error);
        return [];
    }
}

export function getUserFollowers(user_id:any){
    // Get supabase client for direct queries
    const followsClass = new Follows();
    try {
        return followsClass.getFollowers(user_id);
    }
    catch (error) {
        console.error("Error fetching followers:", error);
        return [];
    }
}

export function getUserFollowing(user_id:any){  
    // Get supabase client for direct queries
    const followsClass = new Follows();
    try {
        return followsClass.getFollowing(user_id);
    }

    catch (error) {
        console.error("Error fetching following:", error);
        return [];
    }
}

export async function getUserGroups(user_id:any){
    const groupsClass = new Groups();
    try {
        return await groupsClass.getUserGroups(user_id);
    }
    catch (error) {
        console.error("Error fetching user groups:", error);
        return [];
    }
}

export async function getGroupPosts(group_id:any): Promise<any[]> {
    // This function would require a GroupPosts class to fetch posts related to a group
    // For now, it's just a placeholder to show where you would implement this logic
    const groupsClass = new Groups();
    
    try {
        return await groupsClass.getPosts(group_id);
    }
    catch (error) {
        console.error("Error fetching group posts:", error);
        return [];
    }
}

export async function getUserGroupsPosts(user_id:any){
    // This function would require a GroupPosts class to fetch posts related to a group
    // For now, it's just a placeholder to show where you would implement this logic
    const userGroups = await getUserGroups(user_id);
    let allPosts:any[] = [];
    for (const group of userGroups) {
        const groupPosts = await getGroupPosts(group.id);
        allPosts = allPosts.concat(groupPosts);
    }
    return allPosts;
}