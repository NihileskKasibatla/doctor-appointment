import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const PageNotFound = () => {
    return (
        <div className="page-not-found">
            <Box
                sx={{
                    backgroundColor: "#f5f5f5",
                    height: "89vh",
                    textTransform: "uppercase",
                    padding: "2em 0em 4em 2em",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: "#319997",
                        marginTop: "3em",
                        marginBottom: "1em",
                        textAlign: "center",
                    }}
                >
                    404! <br />
                    Page Not Found
                </Typography>
            </Box>
        </div>
    );
};

export default PageNotFound;
