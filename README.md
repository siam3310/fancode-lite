# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## How to Push this Project to Your GitHub Repository

Follow these steps to upload your project code to your own GitHub account.

### Step 1: Download Your Project Code

First, download the project's source code as a `.zip` file from this Firebase Studio environment. There should be a "Download Code" button available.

### Step 2: Prepare Your Computer

1.  **Unzip the File:** Extract the downloaded `.zip` file to a folder on your computer.
2.  **Install Git:** If you don't have Git installed, download and install it from [git-scm.com](https://git-scm.com/).
3.  **Open a Terminal:**
    *   On **Windows**, open **Git Bash** (which comes with Git) or **Command Prompt**.
    *   On **Mac/Linux**, open the **Terminal** application.

### Step 3: Run the Git Commands

Navigate into your unzipped project folder using the terminal. For example, if your folder is on the Desktop, you might use a command like this:
```bash
cd Desktop/your-project-folder-name
```

Now, run the following commands one by one.

1.  **Initialize a new Git repository:**
    ```bash
    git init -b main
    ```

2.  **Add all your files to be tracked:**
    ```bash
    git add .
    ```

3.  **Create your first commit:**
    ```bash
    git commit -m "Initial commit of Fancode Lite project"
    ```

4.  **Connect to your GitHub repository:**
    *(Replace the URL with your own repository's URL.)*
    ```bash
    git remote add origin https://github.com/siam3310/fancode-lite.git
    ```

5.  **Push your code to GitHub:**
    ```bash
    git push -u origin main
    ```

When you run the `git push` command, you might be asked for your GitHub username and password. **For the password, use a Personal Access Token**, not your actual GitHub password.

That's it! After these steps, your code will be successfully uploaded to your GitHub repository.
