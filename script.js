/* =========================================================
   PERSONAL FILES MANAGER
   Supabase Cloud Storage + Database + Authentication
========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
========================================================= */

/*
   Supabase Dashboard nunchi ee values teesukondi.

   Project URL example:
   https://xxxxxxxx.supabase.co

   Publishable Key example:
   eyJhbGciOiJIUzI1NiIs...
*/

const SUPABASE_URL =
    "https://duenbngevoaqnyhnpmjn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Z5H8BUjCKtqhKtLeM1y3vw_LTR_gohg";


/*
   Supabase client
*/

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/*
   Supabase Storage bucket name.

   Supabase lo exactly:
   user-files

   ane bucket create cheyyali.
*/

const BUCKET_NAME = "user-files";



/* =========================================================
   2. WHEN WEBSITE LOADS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Personal Files Manager started."
        );


        /*
           Check existing login session.
        */

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            showAuthPage();

            return;

        }


        if (
            data &&
            data.session
        ) {

            showMainApp(
                data.session.user
            );

        } else {

            showAuthPage();

        }

    }
);



/* =========================================================
   3. AUTHENTICATION STATE
========================================================= */

supabaseClient
    .auth
    .onAuthStateChange(
        function (event, session) {

            console.log(
                "Auth event:",
                event
            );


            if (session) {

                showMainApp(
                    session.user
                );

            } else {

                showAuthPage();

            }

        }
    );



/* =========================================================
   4. SHOW LOGIN PAGE
========================================================= */

function showAuthPage() {

    const authPage =
        document.getElementById(
            "auth-page"
        );

    const mainApp =
        document.getElementById(
            "main-app"
        );


    if (authPage) {

        authPage.classList.remove(
            "hidden"
        );

    }


    if (mainApp) {

        mainApp.classList.add(
            "hidden"
        );

    }

}



/* =========================================================
   5. SHOW MAIN WEBSITE
========================================================= */

async function showMainApp(user) {

    const authPage =
        document.getElementById(
            "auth-page"
        );

    const mainApp =
        document.getElementById(
            "main-app"
        );


    if (authPage) {

        authPage.classList.add(
            "hidden"
        );

    }


    if (mainApp) {

        mainApp.classList.remove(
            "hidden"
        );

    }


    /*
       Show email in navbar.
    */

    const userInfo =
        document.getElementById(
            "userInfo"
        );


    if (userInfo) {

        userInfo.textContent =
            user.email || "";

    }


    /*
       Load saved photos/files.
    */

    await loadPhotos();

    await loadFiles();

}



/* =========================================================
   6. LOGIN
========================================================= */

async function login() {

    const email =
        document
            .getElementById(
                "loginEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value;


    if (
        email === "" ||
        password === ""
    ) {

        showAuthMessage(
            "Please enter email and password.",
            true
        );

        return;

    }


    showAuthMessage(
        "Logging in...",
        false
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .signInWithPassword({

                email: email,

                password: password

            });


    if (error) {

        console.error(
            error
        );

        showAuthMessage(
            error.message,
            true
        );

        return;

    }


    console.log(
        "Login successful:",
        data.user
    );


    showAuthMessage(
        "Login successful!",
        false
    );

}



/* =========================================================
   7. REGISTER
========================================================= */

async function register() {

    const email =
        document
            .getElementById(
                "registerEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "registerPassword"
            )
            .value;


    const confirmPassword =
        document
            .getElementById(
                "registerConfirmPassword"
            )
            .value;


    if (
        email === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        showAuthMessage(
            "Please fill all fields.",
            true
        );

        return;

    }


    if (
        password !==
        confirmPassword
    ) {

        showAuthMessage(
            "Passwords do not match.",
            true
        );

        return;

    }


    if (
        password.length < 6
    ) {

        showAuthMessage(
            "Password must contain at least 6 characters.",
            true
        );

        return;

    }


    showAuthMessage(
        "Creating account...",
        false
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .signUp({

                email: email,

                password: password

            });


    if (error) {

        console.error(
            error
        );

        showAuthMessage(
            error.message,
            true
        );

        return;

    }


    /*
       If email confirmation is enabled,
       user needs to verify email.
    */

    if (!data.session) {

        showAuthMessage(
            "Account created. Please check your email and confirm your account.",
            false
        );

    } else {

        showAuthMessage(
            "Account created successfully!",
            false
        );

    }

}



/* =========================================================
   8. LOGOUT
========================================================= */

async function logout() {

    const {
        error
    } =
        await supabaseClient
            .auth
            .signOut();


    if (error) {

        console.error(
            "Logout error:",
            error
        );

        alert(
            "Logout failed: " +
            error.message
        );

        return;

    }


    console.log(
        "Logged out successfully."
    );

}



/* =========================================================
   9. LOGIN / REGISTER UI
========================================================= */

function showRegister() {

    document
        .getElementById(
            "loginBox"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "registerBox"
        )
        .classList.remove(
            "hidden"
        );


    clearAuthMessage();

}


function showLogin() {

    document
        .getElementById(
            "registerBox"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "loginBox"
        )
        .classList.remove(
            "hidden"
        );


    clearAuthMessage();

}


function showAuthMessage(
    message,
    isError
) {

    const element =
        document.getElementById(
            "authMessage"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.style.color =
        isError
            ? "#dc2626"
            : "#059669";

}


function clearAuthMessage() {

    const element =
        document.getElementById(
            "authMessage"
        );


    if (element) {

        element.textContent = "";

    }

}



/* =========================================================
   10. NAVIGATION
========================================================= */

function showPage(
    pageId,
    button
) {

    /*
       Hide all pages.
    */

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            function (page) {

                page.classList.remove(
                    "active"
                );

            }
        );


    /*
       Remove active from buttons.
    */

    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(
            function (btn) {

                btn.classList.remove(
                    "active"
                );

            }
        );


    /*
       Show selected page.
    */

    const page =
        document.getElementById(
            pageId
        );


    if (page) {

        page.classList.add(
            "active"
        );

    }


    /*
       Activate selected button.
    */

    if (button) {

        button.classList.add(
            "active"
        );

    }


    /*
       Refresh data.
    */

    if (
        pageId ===
        "saved-photos"
    ) {

        loadPhotos();

    }


    if (
        pageId ===
        "saved-files"
    ) {

        loadFiles();

    }

}



/* =========================================================
   11. SAVE PHOTO
========================================================= */

async function savePhoto(event) {

    event.preventDefault();


    /*
       Get logged-in user.
    */

    const {
        data,
        error: userError
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        userError ||
        !data.user
    ) {

        alert(
            "Please login first."
        );

        return;

    }


    const user =
        data.user;


    /*
       Get photo name.
    */

    const name =
        document
            .getElementById(
                "photoName"
            )
            .value
            .trim();


    /*
       Get selected photo.
    */

    const input =
        document
            .getElementById(
                "photoInput"
            );


    const selectedFile =
        input.files[0];


    if (!selectedFile) {

        alert(
            "Please select a photo."
        );

        return;

    }


    /*
       Check photo.
    */

    if (
        !selectedFile.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Please select a valid image."
        );

        return;

    }


    /*
       Create unique storage path.
    */

    const filePath =
        createStoragePath(
            user.id,
            selectedFile.name
        );


    const saveButton =
        document.querySelector(
            "#photoForm .save-button"
        );


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.textContent =
            "Uploading...";

    }


    try {

        /*
           STEP 1:
           Upload photo to Storage.
        */

        const {
            error: uploadError
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKET_NAME
                )
                .upload(
                    filePath,
                    selectedFile,
                    {

                        contentType:
                            selectedFile.type,

                        upsert:
                            false

                    }
                );


        if (uploadError) {

            throw uploadError;

        }


        /*
           STEP 2:
           Save information in database.
        */

        const {
            error:
                databaseError
        } =
            await supabaseClient
                .from(
                    "user_files"
                )
                .insert({

                    user_id:
                        user.id,

                    display_name:
                        name,

                    original_name:
                        selectedFile.name,

                    storage_path:
                        filePath,

                    mime_type:
                        selectedFile.type,

                    file_size:
                        selectedFile.size,

                    file_type:
                        "photo"

                });


        /*
           If database fails,
           remove uploaded photo.
        */

        if (databaseError) {

            await supabaseClient
                .storage
                .from(
                    BUCKET_NAME
                )
                .remove([
                    filePath
                ]);


            throw databaseError;

        }


        /*
           Clear form.
        */

        document
            .getElementById(
                "photoForm"
            )
            .reset();


        alert(
            "Photo saved successfully!"
        );


        /*
           Refresh saved photos.
        */

        await loadPhotos();

    } catch (error) {

        console.error(
            "Photo upload error:",
            error
        );


        alert(
            "Photo upload failed:\n" +
            error.message
        );

    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Save Photo";

        }

    }

}



/* =========================================================
   12. SAVE FILE
========================================================= */

async function saveFile(event) {

    event.preventDefault();


    /*
       Get current user.
    */

    const {
        data,
        error: userError
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        userError ||
        !data.user
    ) {

        alert(
            "Please login first."
        );

        return;

    }


    const user =
        data.user;


    /*
       File name.
    */

    const name =
        document
            .getElementById(
                "fileName"
            )
            .value
            .trim();


    /*
       Selected file.
    */

    const input =
        document
            .getElementById(
                "fileInput"
            );


    const selectedFile =
        input.files[0];


    if (!selectedFile) {

        alert(
            "Please select a file."
        );

        return;

    }


    /*
       Create storage path.
    */

    const filePath =
        createStoragePath(
            user.id,
            selectedFile.name
        );


    const saveButton =
        document.querySelector(
            "#fileForm .save-button"
        );


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.textContent =
            "Uploading...";

    }


    try {

        /*
           Upload file.
        */

        const {
            error: uploadError
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKET_NAME
                )
                .upload(
                    filePath,
                    selectedFile,
                    {

                        contentType:
                            selectedFile.type ||
                            "application/octet-stream",

                        upsert:
                            false

                    }
                );


        if (uploadError) {

            throw uploadError;

        }


        /*
           Save metadata.
        */

        const {
            error:
                databaseError
        } =
            await supabaseClient
                .from(
                    "user_files"
                )
                .insert({

                    user_id:
                        user.id,

                    display_name:
                        name,

                    original_name:
                        selectedFile.name,

                    storage_path:
                        filePath,

                    mime_type:
                        selectedFile.type ||
                        "application/octet-stream",

                    file_size:
                        selectedFile.size,

                    file_type:
                        "file"

                });


        /*
           Remove Storage file if
           database insert fails.
        */

        if (databaseError) {

            await supabaseClient
                .storage
                .from(
                    BUCKET_NAME
                )
                .remove([
                    filePath
                ]);


            throw databaseError;

        }


        /*
           Reset form.
        */

        document
            .getElementById(
                "fileForm"
            )
            .reset();


        alert(
            "File saved successfully!"
        );


        await loadFiles();

    } catch (error) {

        console.error(
            "File upload error:",
            error
        );


        alert(
            "File upload failed:\n" +
            error.message
        );

    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Save File";

        }

    }

}



/* =========================================================
   13. LOAD SAVED PHOTOS
========================================================= */

async function loadPhotos() {

    /*
       Get current user.
    */

    const {
        data,
        error: userError
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        userError ||
        !data.user
    ) {

        return;

    }


    /*
       Get only current user's photos.
    */

    const {
        data: photos,
        error
    } =
        await supabaseClient
            .from(
                "user_files"
            )
            .select("*")
            .eq(
                "file_type",
                "photo"
            )
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            "Load photos error:",
            error
        );

        return;

    }


    const grid =
        document.getElementById(
            "photosGrid"
        );


    const count =
        document.getElementById(
            "photoCount"
        );


    if (!grid) {

        return;

    }


    /*
       Photo count.
    */

    if (count) {

        count.textContent =
            photos.length +
            (
                photos.length === 1
                    ? " Photo"
                    : " Photos"
            );

    }


    /*
       Clear old cards.
    */

    grid.innerHTML = "";


    /*
       Empty message.
    */

    if (
        photos.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                "🖼️",
                "No Photos Saved",
                "Upload your first photo."
            );

        return;

    }


    /*
       Create photo cards.
    */

    for (
        const photo of photos
    ) {

        /*
           Create temporary signed URL.
        */

        const {
            data:
                signedData,
            error:
                signedError
        } =
            await supabaseClient
                .storage
                .from(
                    BUCKET_NAME
                )
                .createSignedUrl(
                    photo.storage_path,
                    3600
                );


        if (signedError) {

            console.error(
                signedError
            );

            continue;

        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "item-card";


        card.innerHTML = `

            <div class="preview">

                <img
                    src="${signedData.signedUrl}"
                    alt="${escapeHTML(
                        photo.display_name
                    )}">

            </div>


            <div class="card-content">

                <div class="file-name">

                    ${escapeHTML(
                        photo.display_name
                    )}

                </div>


                <div class="original-name">

                    Original:
                    ${escapeHTML(
                        photo.original_name
                    )}

                </div>


                <div class="file-size">

                    Size:
                    ${formatSize(
                        photo.file_size
                    )}

                </div>


                <div class="actions">

                    <button
                        class="action-button edit-button"
                        onclick="
                            editItem(
                                '${photo.id}',
                                'photo'
                            )
                        ">

                        ✏️ Edit

                    </button>


                    <button
                        class="action-button download-button"
                        onclick="
                            downloadItem(
                                '${photo.id}'
                            )
                        ">

                        ⬇️ Download

                    </button>


                    <button
                        class="action-button delete-button"
                        onclick="
                            deleteItem(
                                '${photo.id}'
                            )
                        ">

                        🗑️ Delete

                    </button>

                </div>

            </div>

        `;


        grid.appendChild(
            card
        );

    }

}



/* =========================================================
   14. LOAD SAVED FILES
========================================================= */

async function loadFiles() {

    /*
       Get current user.
    */

    const {
        data,
        error: userError
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        userError ||
        !data.user
    ) {

        return;

    }


    /*
       Get user's files.
    */

    const {
        data: files,
        error
    } =
        await supabaseClient
            .from(
                "user_files"
            )
            .select("*")
            .eq(
                "file_type",
                "file"
            )
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            "Load files error:",
            error
        );

        return;

    }


    const grid =
        document.getElementById(
            "filesGrid"
        );


    const count =
        document.getElementById(
            "fileCount"
        );


    if (!grid) {

        return;

    }


    if (count) {

        count.textContent =
            files.length +
            (
                files.length === 1
                    ? " File"
                    : " Files"
            );

    }


    grid.innerHTML = "";


    /*
       No files.
    */

    if (
        files.length === 0
    ) {

        grid.innerHTML =
            emptyMessage(
                "📂",
                "No Files Saved",
                "Upload your first file."
            );

        return;

    }


    /*
       Create cards.
    */

    files.forEach(
        function(file) {

            const extension =
                getExtension(
                    file.original_name
                );


            const icon =
                getFileIcon(
                    extension
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "item-card";


            card.innerHTML = `

                <div class="file-preview">

                    <div class="file-icon">

                        ${icon}

                    </div>


                    <div class="file-extension">

                        ${
                            extension ||
                            "FILE"
                        }

                    </div>

                </div>


                <div class="card-content">

                    <div class="file-name">

                        ${escapeHTML(
                            file.display_name
                        )}

                    </div>


                    <div class="original-name">

                        Original:
                        ${escapeHTML(
                            file.original_name
                        )}

                    </div>


                    <div class="file-size">

                        Type:
                        ${escapeHTML(
                            file.mime_type ||
                            "Unknown"
                        )}

                        <br>

                        Size:
                        ${formatSize(
                            file.file_size
                        )}

                    </div>


                    <div class="actions">

                        <button
                            class="action-button edit-button"
                            onclick="
                                editItem(
                                    '${file.id}',
                                    'file'
                                )
                            ">

                            ✏️ Edit

                        </button>


                        <button
                            class="action-button download-button"
                            onclick="
                                downloadItem(
                                    '${file.id}'
                                )
                            ">

                            ⬇️ Download

                        </button>


                        <button
                            class="action-button delete-button"
                            onclick="
                                deleteItem(
                                    '${file.id}'
                                )
                            ">

                            🗑️ Delete

                        </button>

                    </div>

                </div>

            `;


            grid.appendChild(
                card
            );

        }
    );

}



/* =========================================================
   15. EDIT / RENAME
========================================================= */

async function editItem(
    id,
    type
) {

    /*
       Get item.
    */

    const {
        data: item,
        error
    } =
        await supabaseClient
            .from(
                "user_files"
            )
            .select("*")
            .eq(
                "id",
                id
            )
            .single();


    if (
        error ||
        !item
    ) {

        alert(
            "Item not found."
        );

        return;

    }


    /*
       Ask new name.
    */

    const newName =
        prompt(
            "Enter new name:",
            item.display_name
        );


    if (
        newName === null
    ) {

        return;

    }


    if (
        newName.trim() === ""
    ) {

        alert(
            "Name cannot be empty."
        );

        return;

    }


    /*
       Update database.
    */

    const {
        error:
            updateError
    } =
        await supabaseClient
            .from(
                "user_files"
            )
            .update({

                display_name:
                    newName.trim()

            })
            .eq(
                "id",
                id
            );


    if (updateError) {

        alert(
            "Rename failed:\n" +
            updateError.message
        );

        return;

    }


    /*
       Refresh page.
    */

    if (
        type === "photo"
    ) {

        await loadPhotos();

    } else {

        await loadFiles();

    }

}



/* =========================================================
   16. DOWNLOAD
========================================================= */

async function downloadItem(
    id
) {

    /*
       Find database record.
    */

    const {
        data: item,
        error
    } =
        await supabaseClient
            .from(
                "user_files"
            )
            .select("*")
            .eq(
                "id",
                id
            )
            .single();


    if (
        error ||
        !item
    ) {

        alert(
            "File not found."
        );

        return;

    }


    /*
       Download from Supabase Storage.
    */

    const {
        data: blob,
        error:
            downloadError
    } =
        await supabaseClient
            .storage
            .from(
                BUCKET_NAME
            )
            .download(
                item.storage_path
            );


    if (downloadError) {

        console.error(
            downloadError
        );

        alert(
            "Download failed:\n" +
            downloadError.message
        );

        return;

    }


    /*
       Create temporary browser URL.
    */

    const url =
        URL.createObjectURL(
            blob
        );


    /*
       Create download link.
    */

    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        item.original_name;


    document
        .body
        .appendChild(
            link
        );


    link.click();


    link.remove();


    /*
       Remove temporary URL.
    */

    setTimeout(
        function () {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}



/* =========================================================
   17. DELETE
========================================================= */

async function deleteItem(
    id
) {

    /*
       Get item.
    */

    const {
        data: item,
        error
    } =
        await supabaseClient
            .from(
                "user_files"
            )
            .select("*")
            .eq(
                "id",
                id
            )
            .single();


    if (
        error ||
        !item
    ) {

        alert(
            "Item not found."
        );

        return;

    }


    /*
       Confirm.
    */

    const confirmed =
        confirm(
            "Are you sure you want to delete this item?"
        );


    if (!confirmed) {

        return;

    }


    /*
       Delete actual file.
    */

    const {
        error:
            storageError
    } =
        await supabaseClient
            .storage
            .from(
                BUCKET_NAME
            )
            .remove([
                item.storage_path
            ]);


    if (storageError) {

        console.error(
            storageError
        );

        alert(
            "Storage delete failed:\n" +
            storageError.message
        );

        return;

    }


    /*
       Delete database record.
    */

    const {
        error:
            databaseError
    } =
        await supabaseClient
            .from(
                "user_files"
            )
            .delete()
            .eq(
                "id",
                id
            );


    if (databaseError) {

        console.error(
            databaseError
        );

        alert(
            "Database delete failed:\n" +
            databaseError.message
        );

        return;

    }


    /*
       Refresh correct page.
    */

    if (
        item.file_type ===
        "photo"
    ) {

        await loadPhotos();

    } else {

        await loadFiles();

    }


    alert(
        "Deleted successfully."
    );

}



/* =========================================================
   18. CREATE STORAGE PATH
========================================================= */

function createStoragePath(
    userId,
    originalName
) {

    /*
       Remove unsafe characters.
    */

    const safeName =
        originalName
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );


    /*
       Create unique ID.
    */

    const uniqueId =
        crypto.randomUUID();


    /*
       Folder structure:

       user-id/
          unique-id-filename
    */

    return (
        userId +
        "/" +
        uniqueId +
        "-" +
        safeName
    );

}



/* =========================================================
   19. EMPTY MESSAGE
========================================================= */

function emptyMessage(
    icon,
    title,
    message
) {

    return `

        <div class="empty">

            <div class="empty-icon">

                ${icon}

            </div>


            <h2>

                ${title}

            </h2>


            <p>

                ${message}

            </p>

        </div>

    `;

}



/* =========================================================
   20. FILE EXTENSION
========================================================= */

function getExtension(
    filename
) {

    if (
        !filename ||
        !filename.includes(".")
    ) {

        return "";

    }


    const parts =
        filename.split(".");


    return parts[
        parts.length - 1
    ].toUpperCase();

}



/* =========================================================
   21. FILE ICON
========================================================= */

function getFileIcon(
    extension
) {

    const icons = {

        PDF: "📕",

        DOC: "📘",

        DOCX: "📘",

        XLS: "📗",

        XLSX: "📗",

        PPT: "📙",

        PPTX: "📙",

        TXT: "📄",

        CSV: "📊",

        ZIP: "🗜️",

        RAR: "🗜️",

        MP3: "🎵",

        WAV: "🎵",

        MP4: "🎬",

        AVI: "🎬",

        MOV: "🎬",

        JPG: "🖼️",

        JPEG: "🖼️",

        PNG: "🖼️",

        GIF: "🖼️",

        WEBP: "🖼️",

        SVG: "🖼️"

    };


    return (
        icons[extension] ||
        "📄"
    );

}



/* =========================================================
   22. FILE SIZE
========================================================= */

function formatSize(
    bytes
) {

    if (
        !bytes ||
        bytes === 0
    ) {

        return "0 Bytes";

    }


    const units = [

        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB"

    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (

        parseFloat(

            (
                bytes /
                Math.pow(
                    1024,
                    index
                )
            ).toFixed(2)

        )

        +

        " "

        +

        units[index]

    );

}



/* =========================================================
   23. HTML SECURITY
========================================================= */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;

}